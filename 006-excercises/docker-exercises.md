# Docker Fundamentals Exercises

A hands-on guide with progressive Docker exercises.

---

## Module 1: Basic Concepts & First Containers

### [ ] **Exercise 1.1 – Installing Docker**

- Install Docker Desktop (Windows/macOS) or Docker Engine (Linux).

- Verify installation with:

  ```bash
  docker version
  docker info
  ```

### [ ] **Exercise 1.2 – Running Your First Container**

- Run the `hello-world` container:

  ```bash
  docker run hello-world
  ```

- Explain the output.

### [ ] **Exercise 1.3 – Exploring Images**

- List local images:

  ```bash
  docker images
  ```

- Pull and run the NGINX container:

  ```bash
  docker pull nginx
  docker run -d -p 8080:80 nginx
  docker ps
  ```

- Access NGINX via `http://localhost:8080`.

---

## Module 2: Container Management

### [ ] **Exercise 2.1 – Interacting with Containers**

- Run Ubuntu container in interactive mode:

  ```bash
  docker run -it ubuntu bash
  ```

- Explore filesystem, install `curl`, then exit.

### [ ] **Exercise 2.2 – Managing Containers**

- List all containers:

  ```bash
  docker ps -a
  ```

- Stop and remove containers:

  ```bash
  docker stop <container_id>
  docker rm <container_id>
  ```

- Remove unused images:

  ```bash
  docker rmi <image_id>
  ```

---

## Module 3: Dockerfile & Custom Images

### [ ] **Exercise 3.1 – Creating a Custom Image**

- Create a `Dockerfile` using `python:3.10` and a `app.py` script that prints "Hello Docker".

- Example `Dockerfile`:

  ```dockerfile
  FROM python:3.10
  COPY app.py /app.py
  CMD ["python", "/app.py"]
  ```

- Build and run the image:

  ```bash
  docker build -t hello-docker .
  docker run hello-docker
  ```

### [ ] **Exercise 3.2 – Using .dockerignore**

- Add unnecessary files.
- Create a `.dockerignore` to exclude them.
- Rebuild and confirm ignored files.

---

## Module 4: Volumes, Persistence and Multi Containers Apps

### [ ] **Exercise 4.1 – Using Named Volumes**

- Run MySQL with a volume:

  ```bash
  docker run -d \
    -e MYSQL_ROOT_PASSWORD=root \
    -v mysql_data:/var/lib/mysql \
    --name db mysql
  ```

- Restart and check if data persists.

### [ ] **Exercise 4.2 – Bind Mounts**

- Create a local HTML site.

- Mount it into the NGINX container:

  ```bash
  docker run -d -p 8080:80 \
    -v $(pwd)/mysite:/usr/share/nginx/html nginx
  ```

### [ ] **Exercise 4.3 – Simple CRUD**

- Enter the folder ```005-simple-crud```

- Follow the instructions on ```README.md``` file to run a multi-container application with docker.

---

## Module 5: Docker Compose

For docker compose exercises you'll will need to clone **Docker Compose Fundamentals** repository:

```
git clone https://github.com/kirkgo/docker-compose-fundamentals
```

### [ ] **Exercise 5.1 – Defining Multiple Services**

- Create `docker-compose.yml` with:

  - `nginx` (port 8080)
  - `mysql` with volume
  - `phpmyadmin` linked to `mysql`

### [ ] **Exercise 5.2 – Starting and Stopping Services**

- Start with:

  ```bash
  docker-compose up -d
  ```

- Verify access to NGINX and phpMyAdmin.

- Tear down with:

  ```bash
  docker-compose down -v
  ```

---

## Module 6: Debugging and Inspection

### [ ] **Exercise 6.1 – Inspecting Containers and Networks**

- Use:

  ```bash
  docker inspect <container>
  docker logs <container>
  docker exec -it <container> bash
  docker network ls
  ```

- Create and attach to custom networks.

---

Happy Dockering! 🚀
