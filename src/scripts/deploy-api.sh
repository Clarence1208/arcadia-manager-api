#!/bin/bash

# Check if parameters are passed
if [ $# -ne 3 ]; then
    echo "Usage: $0 <name> <subdomain> <path_to_sql_file>"
    exit 1
fi

name=$1
subdomain=$2
path_to_sql_file=$3

# Define the username, server address, and password for SCP and SSH
server_user="root"
server_address="46.105.48.77"
server_password="4q2@a@XYIb98Ur"

# Path where the SQL file will be placed on the server
remote_sql_path="/root/scripts/api-config-input.sql"

# Use scp to copy the SQL file to the server
echo "Copying SQL file to the server..."
if sshpass -p $server_password scp -o StrictHostKeyChecking=no $path_to_sql_file $server_user@$server_address:$remote_sql_path; then
    echo "File copied successfully"
else
    echo "Failed to copy file"
    exit 1
fi

# Connect to the server via ssh and execute the script with the SQL file path
echo "Deploying API using the SQL script..."
if sshpass -p $server_password ssh -o StrictHostKeyChecking=no $server_user@$server_address << EOF
    # Execute commands on the server
    bash /root/scripts/deploy-api.sh ${name} ${subdomain} api-config-input.sql
EOF
then
    echo "API deployment successful"
else
    echo "Failed to deploy API"
    exit 1
fi
