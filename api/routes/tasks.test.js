const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const router = require("./tasks"); // Assurez-vous d'importer votre fichier de routes correctement.

describe("Test des routes API", () => {
  it("Devrait retourner toutes les tâches", async () => {
    const response = await request(app).get("/tasks");
    expect(response.statusCode).toBe(200);
  });

  it("Devrait créer une nouvelle tâche", async () => {
    const newTask = { title: "Nouvelle tâche", _id: "test" };
    const response = await request(app)
      .post("/tasks")
      .send(newTask);
    expect(response.statusCode).toBe(201);
  });

  it("Devrait mettre à jour une tâche existante", async () => {
    const taskId = "65452319eade1887d4dfa56d"; // Remplacez par une ID valide.
    const updatedTask = [{"propName": "title", "value": "Nouvelle tâche updatedd"}];
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send(updatedTask);

    expect(response.statusCode).toBe(200);
  });

  it("Devrait supprimer une tâche existante", async () => {
    const taskId = "654523505ff47b6f98af5964"; // Remplacez par une ID valide.
    const response = await request(app).delete(`/tasks/${taskId}`);
    expect(response.statusCode).toBe(200);
  });
});
