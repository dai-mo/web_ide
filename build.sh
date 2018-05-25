#!/bin/bash

set -e

package_dir="package"

name=`npm run name --silent`
version=`npm run version --silent`
dist_dir="./dist"
tar_dir="${name}"
tar_file="${tar_dir}-${version}.tgz"

echo " ### Building Angular production application for ${name}, version ${version}"
npm run build-prod
cp .assets/.htaccess "${dist_dir}"

echo "### Packaging Angular production application"
mkdir -p $package_dir
[ -d "${tar_dir}" ] && { echo " -> Deleting '${tar_dir}'' directory" ; rm -Rf "${tar_dir}" ; }
mv "${dist_dir}" "$package_dir/${tar_dir}"
[ -f "${tar_file}" ] &&  { echo " -> Deleting old '${tar_file}'' file" ; rm "${tar_file}" ; }
tar -C $package_dir -zcf "$package_dir/${tar_file}" "${tar_dir}"

echo "Done."
