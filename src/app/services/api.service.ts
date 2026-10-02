import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './config';
import { RecipeModel } from '../admin/model/recipeModel';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  server_url = API_URL;
  constructor(private http: HttpClient) {}

  //get recipe api
  getAllRecipeApi() {
    return this.http.get(`${this.server_url}/all-recipes`);
  }

  //add testimony api
  addTestimonyApi(reqBody: any) {
    return this.http.post(`${this.server_url}/all-testimony`, reqBody);
  }

  //register api
  registerApi(reqBody: any) {
    return this.http.post(`${this.server_url}/register`, reqBody);
  }

  //login api
  loginApi(reqBody: any) {
    return this.http.post(`${this.server_url}/login`, reqBody);
  }

  // appendToken in req header

  appendToken() {
    return {};
  }

  // /recipe/:id/view
  viewRecipeApi(recipeId: string) {
    return this.http.get(
      `${this.server_url}/recipe/${recipeId}/view`,
      this.appendToken(),
    );
  }

  // related-recipe
  relatedRecipeApi(cuisine: string) {
    return this.http.get(
      `${this.server_url}/related-recipes?cuisine=${encodeURIComponent(cuisine)}`,
      this.appendToken(),
    );
  }

  // recipe/:id/download
  downloadRecipeApi(recipeId: string, reqBody: any) {
    return this.http.post(
      `${this.server_url}/recipe/${recipeId}/download`,
      reqBody,
      this.appendToken(),
    );
  }

  // recipe/:id/save
  saveRecipeApi(recipeId: string, reqBody: any) {
    return this.http.post(
      `${this.server_url}/recipe/${recipeId}/save`,
      reqBody,
      this.appendToken(),
    );
  }

  // get-save-recipes
  getUserSavedRecipeApi() {
    return this.http.get(
      `${this.server_url}/get-save-recipes`,
      this.appendToken(),
    );
  }

  // get-save-recipes
  deleteUserSavedRecipeApi(id: string) {
    return this.http.delete(
      `${this.server_url}/save-recipes/${id}/remove`,
      this.appendToken(),
    );
  }

  // user-downloads
  getUserDownloadRecipeApi() {
    return this.http.get(
      `${this.server_url}/user-downloads`,
      this.appendToken(),
    );
  }

  // user/edit
  editUserApi(reqBody: any) {
    return this.http.post(
      `${this.server_url}/user/edit`,
      reqBody,
      this.appendToken(),
    );
  }

  // all-users
  getAllUserApi() {
    return this.http.get(`${this.server_url}/all-users`, this.appendToken());
  }

  // download-list
  getAllDownloadApi() {
    return this.http.get(
      `${this.server_url}/download-list`,
      this.appendToken(),
    );
  }

  // get all feedback
  getAllFeedbackApi() {
    return this.http.get(
      `${this.server_url}/get-testimony`,
      this.appendToken(),
    );
  }

  // feedback/:id/update
  updateFeedbackStatusApi(feedbackId: string, status: string) {
    return this.http.get(
      `${this.server_url}/feedback/${feedbackId}/update?status=${status}`,
      this.appendToken(),
    );
  }

  // get all feedback
  getApprovedFeedbackApi() {
    return this.http.get(`${this.server_url}/get-approved-testimony`);
  }

  // add-recipe
  addRecipeApi(reqBody: any) {
    return this.http.post(
      `${this.server_url}/add-recipe`,
      reqBody,
      this.appendToken(),
    );
  }

  // udpate-recipe
  updateRecipeApi(id: string, reqBody: RecipeModel) {
    return this.http.put(
      `${this.server_url}/recipe/${id}/edit`,
      reqBody,
      this.appendToken(),
    );
  }

  // udpate-recipe
  deleteRecipeApi(id: string) {
    return this.http.delete(
      `${this.server_url}/recipe/${id}/delete`,
      this.appendToken(),
    );
  }

  // Kept for callers that need a fresh download chart; only an admin may fetch it.
  getChartData() {
    return this.getAllDownloadApi();
  }
}
