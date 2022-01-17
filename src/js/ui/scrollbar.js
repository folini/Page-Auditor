  /*!
  * <https://github.com/passariello/>
  * Copyright (c) 2021, Dario Passariello.
  * Licensed under the Apache-2.0 License.
  */

  const scrollbar = ( el, colors, size ) => {

    if(!colors) colors =[ "black", "transparent" ];
    if(!size) size =[ "8px", "8px" ];

    const $style = `${el}{
                        scrollbar-width:auto;
                        scrollbar-color:${colors[0]} ${colors[1]};
                        scrollbar-width: thin;
                        -ms-overflow-style: -ms-autohiding-scrollbar;
                      }
                    ${el}::-webkit-scrollbar {
                        width: ${size[0]};
                        height: ${size[0]};
                      }
                    ${el}::-webkit-scrollbar-track {
                        background: ${colors[1]};
                      }
                    ${el}::-webkit-scrollbar-thumb {
                        background: ${colors[0]};
                      }
                    `;

    let styleToHead = document.createElement( "style" );
    document.head.appendChild( styleToHead );
    styleToHead.innerHTML = $style;

  };

  scrollbar( '#id-page-auditor', ['#008b8b'] );
  scrollbar( '#id-page-auditor-todo', ['#008b8b'] );


