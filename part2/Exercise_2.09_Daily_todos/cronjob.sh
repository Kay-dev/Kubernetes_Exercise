#!/bin/bash

echo "Read $(curl -I -L -s https://en.wikipedia.org/wiki/Special:Random | grep -i location | cut -d " " -f 2)"