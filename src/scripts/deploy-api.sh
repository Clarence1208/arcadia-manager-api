#!/bin/bash

# Check if parameters are passed
if [ $# -ne 3 ]; then
    echo "Usage: $0 <name> <subdomain> <sql_command>"
    exit 1
fi

name=$1
subdomain=$2
sql_command=$3

# connect to the server via ssh with password
if sshpass -p "4q2@a@XYIb98Ur" ssh -o StrictHostKeyChecking=no root@46.105.48.77 << EOF
    # execute commands on the server
    bash /root/scripts/deploy-api.sh ${name} ${subdomain} ${sql_command}
EOF

then
    echo "API deployment successful"
else
    echo "Failed to deploy API"
    exit 1
fi