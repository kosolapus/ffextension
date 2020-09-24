#!/bin/bash

VERSION=borderify_0_0_5.xpi
rm dist/$VERSION
cd src || exit
zip -r ../dist/$VERSION ./*
cd ../
