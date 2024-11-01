class IRequredFields:
    def __init__(self): 
        self.requiredFields = []

class ISerializable:
    def __init__(self): 
        self._id:str = None
        self.created:int = None
        self.updated:int = None

class InventoryItem(IRequredFields, ISerializable): 
    def __init__(self, dict:dict={}): 
        super().__init__()
        self.name:str = None
        self.profile_id:str = None
        self.imgPaths:list[str] = None
        self.price:float = None
        self.shippingStatus:int = None

        for key in dict:
            setattr(self, key, dict[key]) 

        self.requiredFields.append("profile_id")
        self.requiredFields.append("name")
        self.requiredFields.append("price")

class InventoryProfile(IRequredFields, ISerializable): 
    def __init__(self, dict:dict={}): 
        super().__init__()
        self.name:str = None
        self.imgPath:str = None

        for key in dict:
            setattr(self, key, dict[key])

        self.requiredFields.append("name")

class ItemListing(ISerializable): 
    def __init__(self, dict:dict={}): 
        super().__init__()
        
class EbayItemListing(ItemListing):
    def __init__(self, dict:dict={}): 
        super().__init__(dict)

class DepopItemListing(ItemListing):
    def __init__(self, dict:dict={}): 
        super().__init__(dict)

# TODO: implement version tracking
'''
Edit Log Item
[{
    _id: ObjectId, 
    changes: {
        property:string|null, 
        action: set | unset | pull | delete
        target: string|null
    }[]
}]


ex: 
[{
    _id: none
    changes: [
        {property: name, action: set, target: "New Name"}, 
        {property: imgPath, action: set, target: "New Image"}, 
        {property: price, action: set, target: "New Name"}, 
        {property: name, action: set, target: "New Name"}, 
    ]
}]
'''