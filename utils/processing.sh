#!/bin/sh

magick $1 $2
autotrace $2 --output $3
rm $1 $2