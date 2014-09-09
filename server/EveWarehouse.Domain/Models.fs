namespace EveWarehouse.Domain

open Microsoft.WindowsAzure.Storage.Table

module Models = 

    type ApiKey(id : int, code : string, userId : string) =
        inherit TableEntity()

        member val Id = id with get, set
        member val Code = code with get, set

        member this.UserId
            with get () = this.PartitionKey
            and set (value) = this.PartitionKey <- value

        