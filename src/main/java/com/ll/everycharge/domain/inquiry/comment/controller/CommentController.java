package com.ll.everycharge.domain.inquiry.comment.controller;

import com.ll.everycharge.domain.inquiry.comment.dto.CommentModifyRequestDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentModifyResponseDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentRequestDto;
import com.ll.everycharge.domain.inquiry.comment.dto.CommentResponseDto;
import com.ll.everycharge.domain.inquiry.comment.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/api/v1/inquiry/comment", produces = APPLICATION_JSON_VALUE)
@Tag(name = "CommentController", description = "문의게시판 댓글 API")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/all")
    public ResponseEntity< List< CommentResponseDto>> findAll(@RequestParam("inquiryId") Long inquiryId){
        List< CommentResponseDto > responseDtoList = commentService.findAll(inquiryId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public ResponseEntity< List< CommentResponseDto>> createComment(@Valid @RequestBody CommentRequestDto commentRequestDto, Principal principal){
        if(!(principal.getName().equals("admin")  || principal.getName().equals("system"))) throw new RuntimeException("삭제 권한이 없습니다.");
        List< CommentResponseDto > responseDtoList = commentService.save(commentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDtoList);
    }

    @PreAuthorize("#commentModifyRequestDto.writer == 'system' or #commentModifyRequestDto.writer == 'admin'")
    @PutMapping("/modify")
    public ResponseEntity<CommentModifyResponseDto> modifyComment(@Valid @RequestBody CommentModifyRequestDto commentModifyRequestDto){
        CommentModifyResponseDto responseDto = commentService.modify(commentModifyRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete")
    public ResponseEntity< List< CommentResponseDto>> deleteComment(@RequestParam Long commentId, @RequestParam Long inquiryId){
        CommentResponseDto responseDto = commentService.findById(commentId);
        if(responseDto.getWriter().equals("admin") || responseDto.getWriter().equals("system")){
            commentService.delete(commentId);
        }else{
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(commentService.findAll(inquiryId));
    }

    @GetMapping("/find")
    public ResponseEntity< CommentResponseDto> findOne(@RequestParam Long commentId){
        return ResponseEntity.status(HttpStatus.OK).body(commentService.findById(commentId));
    }


    




}
