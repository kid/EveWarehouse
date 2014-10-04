namespace EveWarehouse.Domain

open System
open DigitallyCreated.FSharp.Azure.TableStorage;

module Models = 

    type ApiKeyType =
        | Account
        | Character
        | Corporation

    type ApiKey = {
        [<PartitionKey>] UserId : string
        [<RowKey>] Id : int
        Code : string
        KeyType : ApiKeyType
        AccessMask : int
        ExpirationDate : DateTime option
    }

    module ApiKeyRepository =
        ()