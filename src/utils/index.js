
export function bronchtalkindia_autoRegistration(info) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'POST';
    form.action = 'https://www.bronchtalkindia.com/login/';

    var element1 = document.createElement('INPUT');
    element1.name = 'login_type';
    element1.value = 'Registration';
    element1.type = 'text';
    form.appendChild(element1);

    var element2 = document.createElement('INPUT');
    element2.name = 'full-name';
    element2.value = info.fullname;
    element2.type = 'text';
    form.appendChild(element2);

    var element3 = document.createElement('INPUT');
    element3.name = 'email';
    element3.value = info.email;
    element3.type = 'text';
    form.appendChild(element3);

    var element4 = document.createElement('INPUT');
    element4.name = 'mobile';
    element4.value = info.mobile;
    element4.type = 'text';
    form.appendChild(element4);

    var element5 = document.createElement('INPUT');
    element5.name = 'state';
    element5.value = info.state;
    element5.type = 'text';
    form.appendChild(element5);

    var element6 = document.createElement('INPUT');
    element6.name = 'city';
    element6.value = info.city;
    element6.type = 'text';
    form.appendChild(element6);

    var element7 = document.createElement('INPUT');
    element7.name = 'specialty';
    element7.value = info.specialty;
    element7.type = 'text';
    form.appendChild(element7);
    console.log(form)
    form.submit();
}

export function bronchtalkindia_autoLogIn(info) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'POST';
    form.action = 'https://www.bronchtalkindia.com/login/';

    var element1 = document.createElement('INPUT');
    element1.name = 'login_type';
    element1.value = 'Login';
    element1.type = 'text';
    form.appendChild(element1);

    var element2 = document.createElement('INPUT');
    element2.name = 'email';
    element2.value = info.email;
    element2.type = 'text';
    form.appendChild(element2);

    var element3 = document.createElement('INPUT');
    element3.name = 'password';
    element3.value = info.pass;
    element3.type = 'text';
    form.appendChild(element3);

    form.submit();
}

export function customScrollToId(id) {
    let a = document.createElement('a')
    a.href = `#${id}`
    document.body.appendChild(a)
    a.click()
    a.remove()
}