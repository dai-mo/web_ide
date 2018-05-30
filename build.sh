#!/bin/bash

set -e

name=`npm run name --silent`
version=`npm run version --silent`
dist_dir="./dist"
tar_dir="./${name}"
tar_file="${tar_dir}-${version}.tgz"

echo " ### Building Angular production application for ${name}, version ${version}"
npm run build-prod

echo "### Packaging Angular production application"
mkdir -p package
[ -d "${tar_dir}" ] && { echo " -> Deleting '${tar_dir}'' directory" ; rm -Rf "${tar_dir}" ; }
cp -r "${dist_dir}" "package/${tar_dir}"
[ -f "${tar_file}" ] &&  { echo " -> Deleting old '${tar_file}'' file" ; rm "${tar_file}" ; }
tar -zcf "package/${tar_file}" "package/${tar_dir}"

echo "Done."
