<?php

namespace core\local;

class hook_callbacks {
    public static function example_hook() {
        return true;
    }

    public static function another_example() {
        return true;
    }
    private static function a_private_example() {
        return true;
    }
    protected static function a_protected_example() {
        return true;
    }
}
