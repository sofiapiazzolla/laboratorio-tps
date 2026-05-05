body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.nav {
  display: flex;
  justify-content: space-between;
  background: #2563eb;
  color: white;
  padding: 1rem;
}

.nav a {
  color: white;
  margin-left: 1rem;
  text-decoration: none;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;
}

.cta {
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}

.section {
  padding: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.card button {
  margin-top: 10px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
