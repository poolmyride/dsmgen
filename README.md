
```bash
> npm install -g dsmgen
```
Make your swift file with only variable declaration,
remember to include **{{doMagic}}**

Ex :- User.swift

```swift
import Foundation
import DataStoreKit
class User:ObjectCoder{
    var headOfFamilyName:String?
    var votersInFamily: Int?
    var  mobileNumber: String?
    var userEmail:String?
    var villageTown:String?
    var constituency:String?
    var state:String?
    var createdOn:Double?

    {{doMagic}}

```


In terminal, go to the directory where your file is present

```bash
> dsmgen User.swift
```

## now your file contensts are -

```swift


import Foundation
import DataStoreKit
class User:ObjectCoder{
    var headOfFamilyName:String?
    var votersInFamily: Int?
    var  mobileNumber: String?
    var userEmail:String?
    var villageTown:String?
    var constituency:String?
    var state:String?
    var createdOn:Double?

    	required init(dictionary withDictionary: NSDictionary) {

		self.headOfFamilyName = withDictionary["headOfFamilyName"] as? String
		self.votersInFamily = withDictionary["votersInFamily"] as? Int
		self.mobileNumber = withDictionary["mobileNumber"] as? String
		self.userEmail = withDictionary["userEmail"] as? String
		self.villageTown = withDictionary["villageTown"] as? String
		self.constituency = withDictionary["constituency"] as? String
		self.state = withDictionary["state"] as? String
		self.createdOn = withDictionary["createdOn"] as? Double

	}

	func toDictionary() -> NSDictionary {

	let dic = NSMutableDictionary()
		self.headOfFamilyName != nil ? dic["headOfFamilyName"] = self.headOfFamilyName! : ()
		self.votersInFamily != nil ? dic["votersInFamily"] = self.votersInFamily! : ()
		self.mobileNumber != nil ? dic["mobileNumber"] = self.mobileNumber! : ()
		self.userEmail != nil ? dic["userEmail"] = self.userEmail! : ()
		self.villageTown != nil ? dic["villageTown"] = self.villageTown! : ()
		self.constituency != nil ? dic["constituency"] = self.constituency! : ()
		self.state != nil ? dic["state"] = self.state! : ()
		self.createdOn != nil ? dic["createdOn"] = self.createdOn! : ()
		return dic
	}

	static func identifierKey() -> String {
		return ""
	}
}

```


 **WTF licence**

