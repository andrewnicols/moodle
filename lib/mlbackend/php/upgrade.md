# API Changes for the `mlbackend_php` plugin

## 3.8

- The phi coefficient (Matthews' correlation coefficient) has been replaced by
  the F1 score as the main accuracy metric. Therefore, \mlbackend_php\processor::get_phi
  method has been removed.
