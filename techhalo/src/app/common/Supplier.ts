
export class Supplier {
    'supplierId': number;
    'name': string;
    'image': string;
    'address': string;
    'email': string;
    'phone': string;
    'create_at': Date;

    constructor(id: number, name: string) {
        this.supplierId = id;
        this.name = name;
    }
}