# API Changes for `question/engine/*`

## 4.0

1) A new optional parameter $extraselect has been added as a part of load_questions_usages_where_question_in_state()
method in question/engine/datalib.php, anything passed here will be added to the SELECT list, use this to return extra data.

## 3.9

1) In the past, whenever a question_usage_by_activity was loaded from the database,
the apply_attempt_state was immediately called on every question, whether the
results of doing that were ever used, or not.

   Now we have changed the code flow, so that apply_attempt_state is only called
when some data or processing is requested (e.g. analysing a response or rendering
the question) which requires the question to be fully initialised. This is MDL-67183.

   This change should be completely invisible with everything handled by the question
engine. If you don't change your code, it should continue to work.

   However, to get the full advantage of this change, you should review your code,
and look at every call to get_question or get_behaviour (on a question_attempt or
question_usage_by_activity). The problem with these methods is that the question engine
cannot know what you are planning to do with the question once you have got it.
Therefore, they have to assume that apply_attempt_state must be called - which can be expensive.
If you know that you don't need that (because, for example, you are just going to
look at ->id or ->questiontext or something simple) then you should pass
false to these functions, to get the possible performance benefit.
In addition, there is a new method $qa->get_question_id() to handle that case more simply.

   Note that you don't have worry about this in places like the renderer for your question
type, because by the time you are in the renderer, the question will already have been
initialised.

## 3.7

1) When a question is rendered, the outer div of the question has an id="q123"
added. Unfortunately, this id was not actually unique, leading to bugs like
MDL-52572. Therefore, we have had to change it. The id used now is what
is returned by the new method $qa->get_outer_question_div_unique_id().
The old code that you need to search for and replace with a call to this
method is "'q' . $qa->get_slot()"

   Note, the new method has also been added to Moodle 3.5.6 and 3.6.4, but
returning the old id. This is to help question types that want to support
multiple Moodle versions.

## 3.1, 3.0.3, 2.9.5

1) The field question_display_options::$extrainfocontent is now displayed in the
outcomes (yellow) div by default. It used to be in the info div. If you have
overriden the question renderer, you may need to make a corresponding change.

## 3.0, 2.9.2, 2.8.8

1) The extra internal PARAM constant question_attempt::PARAM_MARK should no
longer be used. (It should not have been used outside the core of the
question system). See MDL-51090 if you want more explanation.
