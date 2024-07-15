import { useLocation, useParams } from 'react-router-dom';
import useGetChat from '../../hooks/useGetChat';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import useCreateMessage from '../../hooks/useCreateMessage';
import { useEffect, useRef, useState } from 'react';
import useGetMessages from '../../hooks/useGetMessages';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { PAGE_SIZE } from '../../constants/page-size';
import useCountMessages from '../../hooks/useCountMessages';
import InfiniteScroll from 'react-infinite-scroller';

const Chat = () => {
  const [message, setMessage] = useState('');

  const params = useParams();
  const chatId = params._id!;
  const { data, error } = useGetChat({ _id: chatId });
  console.log({ error });
  const [createMessage] = useCreateMessage();
  const { data: messages, fetchMore } = useGetMessages({
    chatId,
    skip: 0,
    limit: PAGE_SIZE,
  });

  const divRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { countMessages, messagesCount } = useCountMessages(chatId);

  useEffect(() => {
    countMessages();
  }, [countMessages]);

  const scrollToBottom = () => divRef.current?.scrollIntoView();

  useEffect(() => {
    if (messages?.messages && messages.messages.length <= PAGE_SIZE) {
      setMessage('');
      scrollToBottom();
    }
  }, [location.pathname, messages?.messages]);

  const handleCreateMessage = async () => {
    await createMessage({
      variables: {
        createMessageInput: {
          content: message,
          chatId,
        },
      },
    });

    setMessage('');
    scrollToBottom();
  };

  return (
    <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
      <h1>{data?.chat.name}</h1>
      <Box sx={{ maxHeight: '75vh', overflow: 'auto' }}>
        <InfiniteScroll
          pageStart={0}
          isReverse={true}
          loadMore={() => {
            fetchMore({
              variables: {
                skip: messages?.messages.length,
              },
            });
          }}
          hasMore={
            messages && messagesCount
              ? messages.messages.length < messagesCount
              : false
          }
          useWindow={false}
        >
          {messages ? (
            [...messages.messages]
              .sort((messageA, messageB) => {
                return (
                  new Date(messageA.createdAt).getTime() -
                  new Date(messageB.createdAt).getTime()
                );
              })
              .map((message) => (
                <Grid
                  key={message._id}
                  container
                  alignItems="center"
                  marginBottom="1rem"
                >
                  <Grid item xs={2} lg={1}>
                    <Stack
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar
                        src={message.user.imageUrl}
                        sx={{ width: 52, height: 52 }}
                      />

                      <Typography variant="caption">
                        {message.user.username}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={10} lg={11}>
                    <Stack>
                      <Paper sx={{ width: 'fit-content' }}>
                        <Typography sx={{ padding: '0.9rem' }}>
                          {message.content}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        sx={{ marginLeft: '0.25rem' }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()} -{' '}
                        {new Date(message.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ))
          ) : (
            <div></div>
          )}
          <div ref={divRef} />
        </InfiniteScroll>
      </Box>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          justifySelf: 'flex-end',
          alignItems: 'center',
          width: '100%',
          margin: '1rem 0',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: '100%' }}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder="Message"
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              await handleCreateMessage();
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: '10px' }}
          onClick={handleCreateMessage}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
