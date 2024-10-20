// const apiUrl = 'https://web-chat-app-rust.vercel.app';
const apiUrl = 'http://localhost:8000';



export const login_user = async (formData: unknown) => {
    try {
        const res = await fetch(`${apiUrl}/api/login-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        return data;
    } catch (error: any) {
        console.log(error)
    }


}

export const register_user = async (formData: unknown) => {
    try {
        const res = await fetch(`${apiUrl}/api/register-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        return data;
    } catch (error: any) {
        console.log(error)
    }
}


export const get_all_users = async (id: unknown , token  : string) => {
    
    try {
        const res = await fetch(`${apiUrl}/api/get-all-users?id=${id}`, {
            method: 'GET',
            headers : {
                'authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    } catch (error: any) {
        console.log(error)
    }
}


export const getChatData = async (data: any , token  : string) => {
   
    const { senderId, receiverId } = data;
    try {
        const res = await fetch(`${apiUrl}/api/get-user-chat?senderId=${senderId}&receiverId=${receiverId}`, {
            method: 'GET',
            headers : {
                'authorization': `Bearer ${token}`
            },
        });
        const data = await res.json();
        return data;
    } catch (error: any) {
        console.log(error)
    }
}


export const send_message = async (formData: any , token  : string) => {


    try {
        const res = await fetch(`${apiUrl}/api/send-user-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        return data;
    } catch (error: any) {
        console.log(error)
        console.log('Error at send message (services) : ', error.message);
    }
}



