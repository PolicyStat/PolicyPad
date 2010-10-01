#!/bin/bash

for file in *.dia
do
	dia -e `echo ${file} | sed -e "s/\.dia/\.svg/g"` ${file}
	dia -s 1200x400 -e `echo ${file} | sed -e "s/\.dia/\.png/g"` ${file}
done
