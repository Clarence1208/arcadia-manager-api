#!/bin/bash

# Check if parameters are passed
if [ $# -ne 2 ]; then
    echo "Usage: $0 <name> <subdomain>"
    exit 1
fi

name=$1
subdomain=$2

# connect to the server via ssh with password
if sshpass -p "4q2@a@XYIb98Ur" ssh -o StrictHostKeyChecking=no root@46.105.48.77 << EOF
    # execute commands on the server
    bash /root/scripts/add-nginx.sh ${name} ${subdomain}
EOF

then
    echo "Nginx deployment successful"
else
    echo "Failed to deploy Nginx"
    exit 1
fi