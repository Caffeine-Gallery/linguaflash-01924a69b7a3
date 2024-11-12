export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getLastTranslation' : IDL.Func([], [IDL.Text], ['query']),
    'saveTranslation' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
