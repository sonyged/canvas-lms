#!/bin/bash

set -e

docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
docker attach canvas-lms_web_1

