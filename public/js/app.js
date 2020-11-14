const deleteBtn = document.getElementById('delete-btn');

if(deleteBtn){
    deleteBtn.addEventListener('click', (e)=>{
        let id = e.target.dataset.id;
        console.log(id);
        fetch('/post/'+id,{
            method:'DELETE'
        }).then(()=>{ 
            console.log('removed');
            window.location.href="/";
        }).catch((error) => {
            console.error(error);
          })
    });
}