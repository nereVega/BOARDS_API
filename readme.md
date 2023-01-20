<h1>BOARDS API ENDPOINTS</h1>
<h2>USERS</h2>
<h3><b>GET</b> All Users</h3>
<p>http://localhost:8080/api/users</p>
</br>
<h3><b>GET</b> User by email</h3>
<p>http://localhost:8080/api/users/:email</p>
</br>
<h3><b>POST</b> New User</h3>
<p>http://localhost:8080/api/users</p>
<p>{</p>
<p>        "email": "myemail@gmail.com"</p>
<p>        "password": "mypass000000"</p>
<p>        "username": "username"</p>
<p>}</p>
</br>


</hr>
<h2>BOARDS</h2>
<h3><b>GET</b> Board by ID</h3>
<p>http://localhost:8080/api/boards/:boardId</p>
</br>
<h3><b>POST</b> New Board</h3>
<p>http://localhost:8080/api/boards</p>
<p>{</p>
<p>        "title": "Board Title"</p>
<p>        "owner": "myemail@gmail.com"</p>
<p>}</p>
</br>
<h3><b>PUT</b> Edit Board Tasks</h3>
<p>http://localhost:8080/api/boards/:boardId</p>
<p>{</p>
<p>        "toDoList": ["task 1", "task 3"]</p>
<p>        "doingList": ["task 4", "task 5"]</p>
<p>        "doneList": ["task 2", "task 6"]</p>
<p>}</p>
</br>
<h3><b>DELETE</b> Delete a Board</h3>
<p>http://localhost:8080/api/boards/:boardId</p>
<p>{</p>
<p>        "owner": "myemail@gmail.com"</p>
<p>}</p>