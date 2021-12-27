#!/bin/bash

set -e

docker-compose -f docker-compose.yml -f docker-compose.override.yml run --rm --entrypoint=/bin/bash web -c "$@"
