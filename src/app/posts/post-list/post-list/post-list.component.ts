import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../../post.model';
import { PostsService } from '../../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {
    // postsSub=null;
  }

  posts:Post[]=[];
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  isLoading = false;
  userIsAuthenticated = false;
  public postsSub!: Subscription;
  private authStatusSub!: Subscription;

  ngOnInit(): void {
    this.isLoading=true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub=this.postsService.getPostUpdateListener()
    .subscribe((postData:{posts: Post[], postCount: number})=>{
      this.isLoading=false;
      this.totalPosts = postData.postCount;
      this.posts=postData.posts;
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading=true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
      this.authStatusSub.unsubscribe();
  }

}
