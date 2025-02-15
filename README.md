## Steps to generate a JSON key: 
1. Go to the Google Cloud Console
2. Select IAM and Admin > Service Accounts
3. Select your service account
4. Click Keys > Add key > Create new key
5. Select JSON, then click Create
6. Download the JSON key file

## On MacOS
1. Open Terminal
2. Run the following command to set the environment variable:
```bash
base64 -i gce-jalingo-ctc.json | tr -d '\n' | pbcopy
```
3. Add to repo secrets in GitHub

> Remember to generate expo token and add to repo secrets in GitHub