import { data } from "react-router-dom";
import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query,Permission,Role  } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  
  async createPost({ title, slug, content, featuredImage, status, userId,videoFile }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDataBaseId,      
        conf.appwriteCollectionId,
        slug,
        { title, content, featuredImage, status, userId ,videoFile},
       
      );
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status ,videoFile}) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDataBaseId,
        conf.appwriteCollectionId,
        slug,
        { title, content, featuredImage, status,videoFile }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDataBaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDataBaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      throw error;
    }
  }

  
async getPosts(queries = [
  Query.equal("status", "active"),
  Query.orderDesc("$createdAt")  
]) {
  try {
    return await this.databases.listDocuments(
      conf.appwriteDataBaseId,
      conf.appwriteCollectionId,
      queries
    );
  } catch (error) {
    throw error;
  }
}


  
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      throw error;
    }
  }
 async videoFile (file){
  try {
    return await this.bucket.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    )
  } catch (error) {
    throw error
  }
 }
  
  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      throw error;
    }
  }


async likePost(postId, userId) {
  try {
    
    const existing = await this.databases.listDocuments(
      conf.appwriteDataBaseId,
      conf.appwriteLikesCollectionId,
      [Query.equal("postId", postId), Query.equal("userId", userId)]
    );

    
    const post = await this.databases.getDocument(
      conf.appwriteDataBaseId,
      conf.appwriteCollectionId,
      postId
    );

   
    let updatedLikes = typeof post.likes === "number" ? post.likes : 0;

    
    if (existing.total > 0) {
      await this.databases.deleteDocument(
        conf.appwriteDataBaseId,
        conf.appwriteLikesCollectionId,
        existing.documents[0].$id
      );
      updatedLikes = Math.max(0, updatedLikes - 1);
    } 
  
    else {
      await this.databases.createDocument(
        conf.appwriteDataBaseId,
        conf.appwriteLikesCollectionId,
        ID.unique(),
        { postId, userId }
      );
      updatedLikes++;
    }

    
    await this.databases.updateDocument(
      conf.appwriteDataBaseId,
      conf.appwriteCollectionId,
      postId,
      { likes: updatedLikes }
    );

    return { liked: existing.total === 0, count: updatedLikes };
  } catch (error) {
    console.error("Like post error:", error);
    throw error;
  }
}

async createComment({ postId, userId, username, text }) {
  try {
    return await this.databases.createDocument(
      conf.appwriteDataBaseId,
      conf.appwriteCommentsCollectionId, 
      ID.unique(),
      { postId, userId, username, text },
       [
        Permission.read(Role.any()),
        Permission.delete(Role.user(userId))
      ]
    );
  } catch (error) {
    console.error("Create comment error:", error);
  }
}


async getComments(postId) {
  if (!postId) return { documents: [] };
  try {
    return await this.databases.listDocuments(
      conf.appwriteDataBaseId,
      conf.appwriteCommentsCollectionId,
      [
        Query.equal("postId", [postId]), 
        Query.orderDesc("$createdAt"),
      ]
    );
  } catch (error) {
    console.error("Get comments error:", error);
  }
}
async deleteComment(commentId) {
  try {
    await this.databases.deleteDocument(
      conf.appwriteDataBaseId,
      conf.appwriteCommentsCollectionId, 
      commentId
     
    );
   
    return true;
  } catch (error) {
    console.error("❌ Failed to delete comment:", error);
    return false;
  }
}



 
getFileUrl(fileId) {
  try {
    return `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}`.toString();
  } catch (error) {
    console.error("Error getting file URL:", error);
    return "";
  }
}





}

const service = new Service();
export default service;
