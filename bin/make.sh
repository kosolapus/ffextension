#!/bin/bash

VERSION=borderify_0_0_7.xpi
rm dist/$VERSION
cd src || exit
zip -r ../dist/$VERSION ./*
cd ../
