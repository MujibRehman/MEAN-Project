import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private router: Router) { }

  private posts:Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message:string,posts:any,maxPosts:number}>(this.apiUrl + queryParams)
    .pipe(map((postData)=>{
      return { posts: postData.posts.map((post: { title: any; content: any; _id: any; imagePath:any}) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
      maxPosts: postData.maxPosts
    };
    }))
    .subscribe(transformedPosts=>{
      this.posts=transformedPosts.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: any){
    return this.http.get<{_id: string, title:string, content:string; imagePath:string}>(`${this.apiUrl}/${id}`);
  }

  addPost(title:string, content:string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    return this.http.post<{message:string, post:Post}>(this.apiUrl,postData);
  }

  updatePost(id: any, title: any, content: any, image: any){
    let postData: Post | FormData;
    if(typeof(image)==="object"){
      postData = new FormData();
      postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image,title);
    } else {
      postData = {
        id: id,
        title:title,
        content:content,
        imagePath:image
      }
    }
    return this.http.put(`${this.apiUrl}/${id}`,postData);
  }

  deletePost(postId: string){
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
}
