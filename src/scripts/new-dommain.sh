#!/bin/bash

# Check if parameters are passed
if [ $# -ne 2 ]; then
    echo "Usage: $0 <name> <subdomain>"
    exit 1
fi

name=$1
subdomain=$2

# connect to the server via ssh with password
sshpass -p "4q2@a@XYIb98Ur" ssh -o StrictHostKeyChecking=no root@46.105.48.77 << EOF
    # execute commands on the server
    bash /root/scripts/new-dommain.sh ${name} ${subdomain}
EOF

then
    echo "Domain deployment successful"
else
    echo "Failed to deploy Domain"
    exit 1
fi