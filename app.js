document.addEventListener('DOMContentLoaded', displayPost);
document.querySelector('#post-form').addEventListener('submit', createPost);
document.querySelector('.posts').addEventListener('click', editOrDelete);

class Post {

    async makePost(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        return resData;
    }

    async fetchPost(url) {
        const response = await fetch(url);
        const resData = await response.json();
        return resData;
    }

    async editPost(url, data) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        return resData;
    }

    async deletePost(url) {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resData = await 'Resource Deleted...';
        return resData;
    }

}
const post = new Post();



function displayPost(){
    post.fetchPost('http://localhost:8002/api/posts')
    .then((data) => {
        
        let postHolder = '';
        data.forEach((post) => {

            postHolder += `
                <div class="col-md-3 mb-5">
                    <h4>${post.title}</h4>
                    <p>${post.body}</p>
                    <a href="#" id="${post.id}" class="btn btn-primary btn-sm">Edit</a>
                    <a href="#" id="${post.id}" class="btn btn-danger btn-sm">Del</a>
                </div>
            `;

        });

        const postsContainer = document.querySelector('.posts');
        postsContainer.innerHTML = postHolder;

    })
    .catch(err => console.log(err));
}



function createPost(e){

    if(document.getElementById('title').value === '' || document.getElementById('content').value === ''){
        showAlert('Can not post empty content', 'error');
    } else {
        let data = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value
        }
    
        post.makePost('http://localhost:8002/api/post', data)
        .then(() => displayPost())
        .catch(err => console.error(err));
    
        showAlert('Post Successful', 'success');
    
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
    }

    e.preventDefault();

}

function editOrDelete(e){
    if(e.target.classList.contains('btn-danger')){

        if(confirm('Are you sure you want to delete?')){
            post.deletePost(`http://localhost:8002/api/post/delete/${e.target.id}`)
            .then(() => displayPost())
            .catch(err => console.error(err));

            showAlert('Post Deleted', 'success');
        }

    }else if(e.target.classList.contains('btn-primary')) {

        let title = document.getElementById('title').value,
            content = document.getElementById('content').value;

        if(title === '' || content === ''){
            showAlert('Can not update empty content', 'error');
        } else {
            if(confirm('Are you sure you want to update this content?')){
                let data = {
                    title: document.getElementById('title').value,
                    content: document.getElementById('content').value
                }
                post.editPost(`http://localhost:8002/api/post/update/${e.target.id}`, data)
                .then(() => displayPost())
                .catch(err => console.error(err));
    
                title = document.getElementById('title').value = '';
                content = document.getElementById('content').value = '';
            }
        }

    }

    e.preventDefault();
}

function showAlert(msg, alertType){
    const alertBox = document.createElement('div');
    alertBox.className = alertType;
    alertBox.textContent = msg;

    const cardBody = document.querySelector('.card-body');
    const heading = document.querySelector('.heading');

    cardBody.insertBefore(alertBox, heading);

    setTimeout(() => {
        alertBox.remove();
    }, 2000);
}