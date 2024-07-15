import { useQuery } from '@apollo/client';
import { graphql } from '../gql';

const getMeDocument = graphql(`
  query Me {
    me {
     ...UserFragment
    }
  }
`);

const useGetMe = () => {
  return useQuery(getMeDocument, {
    // This is handled globally
    errorPolicy: 'ignore',
  });
};

export default useGetMe;
