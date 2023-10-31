# This is a description for the including PHP-DI into Moodle core

## Installation

```
installdir=`mktemp -d`
cd "$installdir"
composer require php-di/php-di
cd -
rm -rf lib/php-di/php-di lib/php-di/invoker lib/laravel/serializable-closure
cp -rf "$installdir"/vendor/php-di/php-di lib/php-di/php-di
echo "See instructions in lib/php-di/readme_moodle.md" > lib/php-di/php-di/readme_moodle.txt
git add  lib/php-di/php-di

cp -rf "$installdir"/vendor/php-di/invoker lib/php-di/invoker
echo "See instructions in lib/php-di/readme_moodle.md" > lib/php-di/invoker/readme_moodle.txt
git add  lib/php-di/invoker

cp -rf "$installdir"/vendor/laravel/serializable-closure lib/laravel/serializable-closure
echo "See instructions in lib/php-di/readme_moodle.md" > lib/laravel/serializable-closure/readme_moodle.txt
git add  lib/phplaravel/serializable-closure
```

Now update the thirdpartylibs.xml as appropriate.
