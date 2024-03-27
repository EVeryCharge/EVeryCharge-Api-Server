package com.ll.everycharge.domain.inquiry.comment.repository;


import com.ll.everycharge.domain.inquiry.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository< Comment, Long > {
}
