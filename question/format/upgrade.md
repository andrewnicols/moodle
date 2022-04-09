# API Changes for the `qformat` plugintype

## 4.0

1) The major question bank changes should not affect import/export plugins.
The navigation changes may affect Behat tests. If you encounter this,
the best way to fix it is to use the new navigation steps in MDL-74130.

2) The new validate_file() method in question/format.php can be overwritten
to implement more expensive or detailed file integrity checks for question imports.
There is a simple way to do this if you just want to check that the file is valid UTF-8,
which you can see an example of in format_gift.

3) The ExamView question format has been completely removed.
(The last posts in http://forum.examview.com/index.php?
are from over 10 years ago and there are no moodle.org
discussions about Examview in the last 10 years.)

4) The WebCT question format has been completely removed (WebCT was acquired by Blackboard in 2006).
