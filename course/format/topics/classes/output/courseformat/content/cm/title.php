<?php

namespace format_topics\output\courseformat\content\cm;

class title extends \core_courseformat\output\local\content\cm\title {

    public function get_template_name(\renderer_base $renderer): string {
        return 'format_topics/local/content/cm/title';
    }
}
