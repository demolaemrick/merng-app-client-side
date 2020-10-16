import React, {useState} from 'react'
import { gql, useMutation } from "@apollo/client"

import { Button, Icon, Confirm } from "semantic-ui-react"

import MyPopup from '../util/MyPopup'

import { FETCH_POSTS_QUERY } from '../util/graphql'

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`
const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id 
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`
const DeleteButton = ({ postId, commentId, callback, history }) => {
    const [ confirmOpen, setConfirmOpen ] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePostOrComment] = useMutation(mutation, {
        update(store){
            setConfirmOpen(false)
            if(!commentId){
                const data = store.readQuery({ query: FETCH_POSTS_QUERY });
                const newPosts = data.getPosts.filter(post => post.id !== postId)
                store.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: { getPosts: newPosts },
                });
            }
            if(callback) callback();
            history.push('/')
        },
        variables: { postId, commentId }
    })
    return (
        <>
            <MyPopup
                content={commentId ? 'Delete comment' : 'Delete post'}
            >
                <Button
                    as="div"
                    color="red"
                    onClick={() => setConfirmOpen(true)}
                    floated="right"
                >
                    <Icon name="trash" style={{ margin: 0 }}/>
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={ deletePostOrComment }
            />
        </>
    )
}

export default DeleteButton
