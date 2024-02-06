<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

namespace core_sms;

/**
 * Tests for sms manager
 *
 * @package    core_sms
 * @category   test
 * @copyright  2024 Andrew Lyons <andrew@nicols.co.uk>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \core_sms\manager
 * @covers \core_sms\message
 * @covers \core_sms\gateway
 */
final class manager_test extends \advanced_testcase {
    public static function setUpBeforeClass(): void {
        require_once(__DIR__ . "/fixtures/dummy_gateway.php");
    }

    public function test_gateway_manipulation(): void {
        $this->resetAfterTest();

        $dummygw = $this->getMockClass(\core_sms\gateway::class, [
            'get_send_priority',
            'send',
        ]);

        $manager = \core\di::get(\core_sms\manager::class);
        $gateway = $manager->create_gateway_instance(
            classname: $dummygw,
            config: (object) [
                'data' => 'goeshere',
            ],
            enabled: true,
        );

        $this->assertIsInt($gateway->id);
        $this->assertTrue($gateway->enabled);
        $this->assertEquals('goeshere', $gateway->config->data);

        // Disable the gateway.
        $disabled = $manager->disable_gateway($gateway);
        $this->assertFalse($disabled->enabled);
        $this->assertEquals($gateway->id, $disabled->id);
        $this->assertEquals($gateway->config, $disabled->config);
        $this->assertTrue($gateway->enabled);

        // Enable the gateway.
        $enabled = $manager->enable_gateway($disabled);
        $this->assertTrue($enabled->enabled);
        $this->assertEquals($disabled->id, $enabled->id);
        $this->assertEquals($gateway->config, $enabled->config);
        $this->assertFalse($disabled->enabled);

        // Enabling an enabled gateway should return an identical object but the reference will be different.
        $reenabled = $manager->enable_gateway($enabled);
        $this->assertEquals($enabled, $reenabled);
        $this->assertNotSame($enabled, $reenabled);
    }

    public function test_uninstalled_gateway(): void {
        // We should prevent removal of gateways which hold any data, but if one has been removed, we should not fail.
        $this->resetAfterTest();

        $dummygw = $this->getMockClass(\core_sms\gateway::class, [
            'get_send_priority',
            'send',
        ]);

        $manager = \core\di::get(\core_sms\manager::class);
        $gateway = $manager->create_gateway_instance(
            classname: $dummygw,
            config: (object) [
                'data' => 'goeshere',
            ],
            enabled: true,
        );
        $uninstalledgateway = $manager->create_gateway_instance(
            classname: $dummygw,
            config: (object) [
                'data' => 'goeshere',
            ],
            enabled: true,
        );

        $db = \core\di::get(\moodle_database::class);
        $db->set_field('sms_gateways', 'gateway', 'uninstalled', ['id' => $uninstalledgateway->id]);

        $instances = $manager->get_gateway_instances();
        $this->assertCount(1, $instances);
        $this->assertArrayHasKey($gateway->id, $instances);
        $this->assertArrayNotHasKey($uninstalledgateway->id, $instances);
    }

    public function test_multiple_gateway_instances(): void {
        $this->resetAfterTest();

        $dummygw = $this->getMockClass(
            originalClassName: \core_sms\gateway::class,
            mockClassName: 'dummygw',
            methods: [
                'get_send_priority',
                'send',
            ],
        );
        $otherdummygw = $this->getMockClass(
            originalClassName: \core_sms\gateway::class,
            mockClassName: 'otherdummygw',
            methods: [
                'get_send_priority',
                'send',
            ],
        );

        $manager = \core\di::get(\core_sms\manager::class);
        $gatewaya = $manager->create_gateway_instance(
            classname: $dummygw,
            enabled: true,
        );
        $gatewayb = $manager->create_gateway_instance(
            classname: $otherdummygw,
            enabled: true,
        );
        $gatewayc = $manager->create_gateway_instance(
            classname: $dummygw,
            enabled: false,
        );

        $this->assertNotEquals($gatewaya->id, $gatewayb->id);
        $this->assertNotEquals($gatewaya->id, $gatewayc->id);
        $this->assertNotEquals($gatewayb->id, $gatewayc->id);

        $instances = $manager->get_gateway_instances();
        $this->assertCount(3, $instances);
        $this->assertArrayHasKey($gatewaya->id, $instances);
        $this->assertArrayHasKey($gatewayb->id, $instances);
        $this->assertArrayHasKey($gatewayc->id, $instances);

        $enabled = $manager->get_enabled_gateway_instances();
        $this->assertCount(2, $enabled);
        $this->assertArrayHasKey($gatewaya->id, $enabled);
        $this->assertArrayHasKey($gatewayb->id, $enabled);
        $this->assertArrayNotHasKey($gatewayc->id, $enabled);

        $dummygwinstances = $manager->get_gateway_instances(['gateway' => $dummygw]);
        $this->assertCount(2, $dummygwinstances);
        $this->assertArrayHasKey($gatewaya->id, $dummygwinstances);
        $this->assertArrayNotHasKey($gatewayb->id, $dummygwinstances);
        $this->assertArrayHasKey($gatewayc->id, $dummygwinstances);
    }

    /**
     * @dataProvider gateway_priority_provider
     */
    public function test_get_gateways_for_message(
        string $recipient,
        int $matchcount,
        ?string $gw,
    ): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);
        $ukgw = $manager->create_gateway_instance(\smsgw_dummy\gateway::class, true, (object) [
            'startswith' => (object) [
                '+44' => 100,
                '+61' => 1,
            ],
            'priority' => 0,
        ]);
        $augw = $manager->create_gateway_instance(\smsgw_dummy\gateway::class, true, (object) [
            'startswith' => (object) [
                '+44' => 1,
                '+61' => 100,
            ],
            'priority' => 0,
        ]);


        $message = new message(
            recipient: $recipient,
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
        );

        $gateways = $manager->get_possible_gateways_for_message($message);
        $this->assertCount($matchcount, $gateways);

        $preferredgw = $manager->get_gateway_for_message($message);
        if ($gw === null) {
            $this->assertNull($preferredgw);
            $this->assertFalse($ukgw->can_send($message));
            $this->assertFalse($augw->can_send($message));
        } else {
            $this->assertEquals(${$gw}->id, $preferredgw->id);
            $this->assertTrue(${$gw}->can_send($message));
        }
    }

    public static function gateway_priority_provider(): array {
        return [
            'uk' => [
                '+447123456789',
                2,
                'ukgw',
            ],
            'au' => [
                '+61987654321',
                2,
                'augw',
            ],
            'us' => [
                '+1987654321',
                0,
                null,
            ],
        ];
    }

    public function test_save_message(): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);
        $message = new message(
            recipient: '+447123456789',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: false,
        );

        $saved = $manager->save_message($message);

        $this->assertFalse(isset($message->id));
        $this->assertTrue(isset($saved->id));

        $storedmessage = $manager->get_message(['id' => $saved->id]);
        $this->assertEquals($saved, $storedmessage);

        $updatedmessage = $manager->save_message($saved->with(status: message_status::GATEWAY_SENT));
    }

    public function test_send(): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);
        $gw = $manager->create_gateway_instance(\smsgw_dummy\gateway::class, true);

        $message = $manager->send(
            recipient: '+447123456789',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
        );

        $this->assertInstanceOf(message::class, $message);

        $this->assertIsInt($message->id);
        $this->assertEquals(message_status::GATEWAY_SENT, $message->status);
        $this->assertEquals($gw->id, $message->gateway);

        $this->assertEquals('Hello, world!', $message->content);

        $storedmessage = $manager->get_message(['id' => $message->id]);
        $this->assertEquals($message, $storedmessage);
    }

    public function test_send_sensitive(): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);
        $gw = $manager->create_gateway_instance(\smsgw_dummy\gateway::class, true);

        $message = $manager->send(
            recipient: '+447123456789',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: true,
            async: false,
        );

        $this->assertInstanceOf(message::class, $message);

        $this->assertIsInt($message->id);
        $this->assertEquals(message_status::GATEWAY_SENT, $message->status);
        $this->assertEquals($gw->id, $message->gateway);
        $this->assertNull($message->content);

        $storedmessage = $manager->get_message(['id' => $message->id]);
        $this->assertEquals($message, $storedmessage);
    }

    public function test_send_sensitive_async(): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);

        $this->expectException(\coding_exception::class);
        $manager->send(
            recipient: '+447123456789',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
            sensitive: true,
            async: true,
        );
    }

    public function test_send_no_gateway(): void {
        $this->resetAfterTest();

        $manager = \core\di::get(\core_sms\manager::class);

        $message = $manager->send(
            recipient: '+447123456789',
            content: 'Hello, world!',
            component: 'core',
            messagetype: 'test',
            recipientuserid: null,
        );

        $this->assertInstanceOf(message::class, $message);

        $this->assertIsInt($message->id);
        $this->assertEquals(message_status::GATEWAY_NOT_AVAILABLE, $message->status);
        $this->assertEmpty($message->gateway);
    }

    public function test_get_messages(): void {
        $db = $this->createStub(\moodle_database::class);
        $db->method('get_records')->willReturn([
            (object) [
                'id' => 1,
                'recipient' => '+447123456789',
                'content' => 'Hello, world!',
                'component' => 'core',
                'messagetype' => 'test',
                'recipientuserid' => null,
                'sensitive' => false,
                'status' => message_status::GATEWAY_SENT->value,
                'gateway' => 1,
                'timecreated' => time(),
            ],
        ]);
        \core\di::set(\moodle_database::class, $db);

        $manager = \core\di::get(\core_sms\manager::class);
        $result = $manager->get_messages();
        $this->assertInstanceOf(\Generator::class, $result);

        $messages = iterator_to_array($result);
        $this->assertCount(1, $messages);
        array_walk($messages, fn ($message) => $this->assertInstanceOf(message::class, $message));
    }
}
