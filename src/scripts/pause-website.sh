#!/bin/bash

# Check if parameters are passed
if [ $# -ne 1 ]; then
    echo "Usage: $0 <subdomain>"
    exit 1
fi

subdomain=$1

# connect to the server via ssh with password
if sshpass -p "4q2@a@XYIb98Ur" ssh -o StrictHostKeyChecking=no root@46.105.48.77 << EOF
    # stop the front container
    docker stop ${subdomain}-arcadia-front
EOF

then
    echo "Website paused successfully"
else
    echo "Failed to pause website"
    exit 1
fi