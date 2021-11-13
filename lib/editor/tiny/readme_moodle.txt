This is a description fo the TinyMCE 6 library integration with Moodle.
############################################################################

Upgrade procedure:

# Check out a clean copy of TinyMCE of the target version.
tinymce=`mktemp -d`
cd "${tinymce}"
git clone https://github.com/tinymce/tinymce.git
cd tinymce
git checkout [version]

# Update the typescript configuration to tenerate es6 moduels with es2020 target.
sed -i 's/"module".*es.*",/"module": "es6",/' tsconfig.shared.json
sed -i 's/"target.*es.*",/"target": "es2020",/' tsconfig.shared.json

# Rebuild TinyMCE
yarn
yarn build

# Remove the old TinyMCE configuration and replace it with the newly built version.
rm -rf path/to/moodle/lib/editor/tiny/js
cp -r modules/tinymce/js path/to/moodle/lib/editor/tiny/js

############################################################################
