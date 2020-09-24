#!/bin/bash

rm dist/borderify.xpi
cd src || exit
zip -r ../dist/borderify.xpi ./*
cd ../
