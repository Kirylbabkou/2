class User {
    constructor(person) {
        
        this.data = {
            id: person.id,
            name: person.name || '---',
            email: person.email || '---',
            address: person.address || '---',
            phone: person.phone || '---'
        }
    }

    edit(person) {
        Object.assign(this.data, person);
    }

    get () {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.lastId = 0;
        this.data = [];
    }
    
    add(person) {
        let newUser = new User(person);

        if (newUser.data) {
            newUser.data.id = ++this.lastId;
            this.data.push(newUser);
            return true;
        }

        return false
    }
    
    edit(id, person) {
        if(!id) return false;

        let newUser = this.data.find(newUser => {
            if(newUser.data.id == id) return newUser
        });

        if(!newUser) return false;

        newUser.edit(person);

        return true;
    }
    
    remove(id) {
        if(!id) return false;

        let users = this.data.filter(newUser => {
            return newUser.data.id != id;
        });
        this.data = users;

        return true;
    }

    get() {
        return this.data;
    }
}

class ContactsApp extends Contacts {

    constructor() {
        super();
        
        this.init();
    }
    
    onAdd() {
        let name = this.inputTitleName.value;
        let phone = this.inputTitleTel.value;
        let address = this.inputTitleAddress.value;
        let email = this.inputTitleEmail.value;

        let data = {
            name: name,
            phone: phone,
            address: address,
            email: email
        }
        return this.add(data);
    }

    onEdit(id, divName, divPhone, divAddress, divEmail) {
        divName.contentEditable = 'true';
        divPhone.contentEditable = 'true';
        divAddress.contentEditable = 'true';
        divEmail.contentEditable = 'true';

        const save = _ => {
            divName.contentEditable = 'false';
            divPhone.contentEditable = 'false';
            divAddress.contentEditable = 'false';
            divEmail.contentEditable = 'false';

            let data = {
                name: divName.textContent,
                phone: divPhone.textContent,
                address: divAddress.textContent,
                email: divEmail.textContent
            };

            if (this.edit(id, data)) this.update()
        }

        divName.addEventListener('keyup', event => {
            if (event.key == 'Enter' && event.ctrlKey == true)
            save();
        })
        divPhone.addEventListener('keyup', event => {
            if (event.key == 'Enter' && event.ctrlKey == true)
            save();
        })
        divAddress.addEventListener('keyup', event => {
            if (event.key == 'Enter' && event.ctrlKey == true)
            save();
        })
        divEmail.addEventListener('keyup', event => {
            if (event.key == 'Enter' && event.ctrlKey == true)
            save();
        })
    }

    onRemove(id) {
        if (this.remove(id)) this.update()
    }

    update() {
        let data = this.get();

        this.storage = data;
        
        this.listElem.innerHTML = '';

        data.forEach(item => {
            this.listShow = document.createElement('li');
            this.listShow.classList.add('listShow');

            let wrapperName = document.createElement('div');
            wrapperName.classList.add('wrapper_name');

            let wrapperPhone = document.createElement('div');
            wrapperPhone.classList.add('wrapper_phone');

            let wrapperAddress = document.createElement('div');
            wrapperAddress.classList.add('wrapper_address');

            let wrapperEmail = document.createElement('div');
            wrapperEmail.classList.add('wrapper_email');
            
            let spanName = document.createElement('span');
            let spanPhone = document.createElement('span');
            let spanAddress = document.createElement('span');
            let spanEmail = document.createElement('span');

            spanName.innerHTML = 'ФИО: ';
            spanPhone.innerHTML = 'Тел: ';
            spanAddress.innerHTML = 'Адрес: ';
            spanEmail.innerHTML = 'Email: ';

            let divName = document.createElement('div');
            divName.classList.add('dName');
            
            let divPhone = document.createElement('div');
            divPhone.classList.add('dPhone');
            let divAddress = document.createElement('div');
            divAddress.classList.add('dAddress');
            let divEmail = document.createElement('div');
            divEmail.classList.add('dEmail');

            let close = document.createElement('button');
            close.classList.add('closeListElem');
            close.innerHTML = '&#10008;';

            let btnEdit = document.createElement('button');
            btnEdit.classList.add('edit');
            btnEdit.innerHTML = 'Edit';

            divName.innerHTML = item.data.name;
            divPhone.innerHTML = item.data.phone;
            divAddress.innerHTML = item.data.address;
            divEmail.innerHTML = item.data.email;

            wrapperName.append(spanName, divName);
            wrapperPhone.append(spanPhone, divPhone);
            wrapperAddress.append(spanAddress, divAddress);
            wrapperEmail.append(spanEmail, divEmail);

            this.listShow.append(wrapperName, wrapperPhone, wrapperAddress, wrapperEmail, close, btnEdit);
            this.listElem.append(this.listShow);

            btnEdit.addEventListener('click', _ => {
                this.onEdit(item.data.id, divName, divPhone, divAddress, divEmail);
            });

            close.addEventListener('click', _ => {
                this.onRemove(item.data.id)
            });

        });
        
    }

    setCookie(name, value, options = {}) {
        options = {
        path: '/',
        ...options
        };
        if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
        }
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
        }
        document.cookie = updatedCookie;
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    set storage(data) {
        const jsonData = JSON.stringify(data);
        localStorage.setItem('localData', jsonData);
        
        this.setCookie('localDataExp', '1', { 'max-age': 10 });
    }

    get storage() {
        let localData = localStorage.getItem('localData');
        if (!localData) return [];

        let data = JSON.parse(localData);
        return data;
    }

    async getData() {
        const data = await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(result => result);

        if(data && data.length > 0) {
            data.forEach(item => {
                
                this.add({
                    name: item.name,
                    phone: item.phone,
                    address: 
                        item.address.city +
                        item.address.street +
                        item.address.suite,
                    email: item.email
                });
            });
            console.log(this.data);
            this.update();
        }
    }
    
    init () {
        let listElem = document.createElement('ul');
        let body = document.body;

        listElem.classList.add('contacts');
        body.append(listElem);

        let btnAddELem = document.querySelector('button');
        btnAddELem.addEventListener('click', event => {
            event.preventDefault()
            if (this.onAdd()) {
                
                this.inputTitleName.value = '';
                this.inputTitleTel.value = '';
                this.inputTitleAddress.value = '';
                this.inputTitleEmail.value = '';

                this.update();
            }
        });

        this.inputTitleName = document.querySelector('.name');
        this.inputTitleTel = document.querySelector('.tel');
        this.inputTitleAddress = document.querySelector('.address');
        this.inputTitleEmail = document.querySelector('.email');
        this.listElem = document.querySelector('.contacts');

        let localDataExp = this.getCookie('localDataExp');
        if (!localDataExp) this.storage = [];

        let localData = this.storage;
        if (localData.length > 0) {
            
            this.storage.forEach(newUser => {
                this.add(newUser.data);
            });

        } else this.getData();

        this.update();
    }
}

let contactsApp = new ContactsApp()



