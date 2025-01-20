## 💡API Help

- Starting from version 2.3, external API call interfaces are supported.
- The main interface is the Dispatch interface plus the entry point. For example, if your Dispatch is http://127.0.0.1:8080, both request parameters and responses are in JSON format.
- (1) Create Session Interface: http://127.0.0.1:8080/muip/create_session (Supports POST)
  - Optional parameter: key_type (type, supports only PEM or default XML)
  - Response example:
  ```json
  {
    "code": 0,
    "message": "Created!",
    "data": {
        "rsaPublicKey": "***",
        "sessionId": "***",
        "expireTimeStamp": ***
    }
  }
  ```
- (2) Authorization Interface: http://127.0.0.1:8080/muip/auth_admin (Supports POST)
  - Required parameter 1: SessionId (obtained after requesting the Create Session interface)
  - Required parameter 2: admin_key (configured in config.json under MuipServer.AdminKey and encrypted with rsaPublicKey [obtained from Create Session interface] using RSA [pacs#1])
  - Response example:
  ```json
  {
    "code": 0,
    "message": "Authorized admin key successfully!",
    "data": {
        "sessionId": "***",
        "expireTimeStamp": ***
    }
  }
  ```
- (3) Command Execution Interface: http://127.0.0.1:8080/muip/exec_cmd (Supports POST/GET)
  - Required parameter 1: SessionId (obtained after requesting the Create Session interface)
  - Required parameter 2: Command (command to be executed, encrypted with rsaPublicKey [obtained from Create Session interface] using RSA [pacs#1])
  - Required parameter 3: TargetUid (UID of the player executing the command)
  - Response example:
    ```json
    {
      "code": 0,
      "message": "Success",
      "data": {
          "sessionId": "***",
          "message": "*** //base64 encoded"
      }
    }
    ```
- (4) Server Status Interface: http://127.0.0.1:8080/muip/server_information (Supports POST/GET)
  - Required parameter 1: SessionId (obtained after requesting the Create Session interface)
  - Response example:
   ```json
    {
      "code": 0,
      "message": "Success",
      "data": {
          "onlinePlayers": [
              {
                  "uid": 10001,
                  "name": "KEVIN",
                  "headIconId": 208001
              },
              ....
          ],
          "serverTime": 1720626191,
          "maxMemory": 16002.227,
          "usedMemory": 7938.5547,
         "programUsedMemory": 323
      }
    }
    ```
- (5) Player Information Interface: http://127.0.0.1:8080/muip/player_information (Supports POST/GET)
  - Required parameter 1: SessionId (obtained after requesting the Create Session interface)
  - Required parameter 2: Uid (player UID)
  - Response example:
   ```json
    {
      "code": 0,
      "message": "Success",
      "data": {
          "uid": 10001,
          "name": "KEVIN",
          "signature": "",
          "headIconId": 208001,
          "curPlaneId": 10001,
          "curFloorId": 10001001,
          "playerStatus": "Explore",
          "stamina": 182,
          "recoveryStamina": 4,
          "assistAvatarList": Array[0],
          "displayAvatarList": Array[0],
          "finishedMainMissionIdList": Array[38],
          "finishedSubMissionIdList": Array[273],
          "acceptedMainMissionIdList": Array[67],
          "acceptedSubMissionIdList": Array[169]
      }
  }
  ```
