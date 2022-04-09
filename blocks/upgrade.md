# API Changes for the `core_block` system and plugintype

## 4.0

- Block block_quiz_results has been completely removed from core.
The Quiz results block is hidden by default since Moodle 2.9. It is recommended to use the Activity results block instead, which works with any type of activity (not just quizzes).
- External function core_block::get_dashboard_blocks has a new parameter to indicate if you want to receive the block on the my/courses page.
- The `core_block_fetch_addable_blocks` external method accepts an optional `subpage` parameter, in order to correctly
  calculate available blocks for pages that use this property (e.g. the user dashboard)
- A new method, can_block_be_added(), has been added to let blocks override it when they want to include some extra checks
to decide whether the block can be added to a page or not.

## 3.8

- Block block_community is no longer a part of core.
- Block block_participants is no longer a part of core.
- Block plugins should overwrite get_config_for_external function to return the blocks settings viewable by the current user.
  If the block plugin does not have any setting that could be considerated private (like a private/access key/token),
  is ok to return all the settings via the get_config_for_external function.

## 3.7

- The block:addinstance capability is no longer required if the block can only be added to a dashboard.
