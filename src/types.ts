
/*
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
        self.listings:list[ItemListing] = None

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
*/


export interface ISerializable {
    _id:string
    created:number
    updated:number
}

export interface InventoryProfile extends ISerializable {
    name:string
    imgPath:string
}

export interface InventoryItem extends ISerializable {
    name:string
    profile_id:string
    imgPaths:string[]
    price:number
    category:string, 
    subcategory:string,
    brand:string,
    shippingStatus:number
}

export const ProductCategories = {
    "Tops": [
        "T-shirt",
        "Tank top",
        "Crop top",
        "Tube top",
        "Blouse",
        "Camisole",
        "Peplum top",
        "Sleeveless top",
        "Short sleeve top",
        "Long sleeve top",
        "Halter top",
        "Turtleneck",
        "Jean top",
        "Smock",
        "Polo shirt",
        "Hoodie"
    ], 
    "Bottoms": [
        "Jeans",
        "Chinos",
        "Cargo pants",
        "Leggings",
        "Joggers",
        "Sweatpants",
        "Shorts",
        "Capri pants",
        "Palazzo pants",
        "Baggy pants",
        "Tapered pants",
        "Flared pants",
        "Bootcut pants",
        "Dress pants",
        "Overalls",
        "Jumpsuits"
    ]
}

export const ClothingBrands = [
    "Nike",
    "Louis Vuitton",
    "Chanel",
    "Hermes",
    "Gucci",
    "Dior",
    "Adidas",
    "Zara",
    "H&M",
    "Calvin Klein",
    "Tommy Hilfiger",
    "Levi's",
    "Burberry",
    "Prada",
    "Lululemon",
    "Forever 21"
]
