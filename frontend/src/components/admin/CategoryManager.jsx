import React, { useEffect, useState } from 'react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('/api/category/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch('/api/category/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, description })
    });
    if (res.ok) {
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setName('');
      setSlug('');
      setDescription('');
    }
  };

  const handleDelete = async id => {
    await fetch(`/api/category/categories/${id}`, { method: 'DELETE' });
    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Categories</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <label htmlFor="category-name">Name</label>
        <input id="category-name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <label htmlFor="category-slug">Slug</label>
        <input id="category-slug" name="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" required />
        <label htmlFor="category-description">Description</label>
        <input id="category-description" name="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            <strong>{category.name}</strong> ({category.slug})
            <button onClick={() => handleDelete(category._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager; 