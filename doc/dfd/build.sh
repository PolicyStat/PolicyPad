#!/bin/bash

for file in *.dia
do
	dia -e `echo ${file} | sed -e "s/\.dia/\.svg/g"` ${file}
done
