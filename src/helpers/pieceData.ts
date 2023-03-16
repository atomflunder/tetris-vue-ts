import { Piece } from './pieces';

// These rotations are from the "Super Rotation System (SRS)"
// https://strategywiki.org/wiki/Tetris/Rotation_systems

const iRotations = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]
];

const jRotations = [
    [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];

const lRotations = [
    [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];

const oRotations = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
];

const sRotations = [
    [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];

const zRotations = [
    [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
    ]
];

const tRotations = [
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
];

/**
 * Returns one of each piece, in order: I, J, L, O, S, Z, T.
 */
export const allPieces: Piece[] = [
    new Piece('I', 1, iRotations),
    new Piece('J', 2, jRotations),
    new Piece('L', 3, lRotations),
    new Piece('O', 4, oRotations),
    new Piece('S', 5, sRotations),
    new Piece('Z', 6, zRotations),
    new Piece('T', 7, tRotations)
];

/**
 * This is for rendering the preview of upcoming/held pieces.
 */
export const getDefaultPiece = (pieceType: string | null): number[][] => {
    switch (pieceType) {
        case 'I':
            return [
                [0, 0, 0, 0],
                [1, 1, 1, 1]
            ];
        case 'J':
            return [
                [2, 0, 0, 0],
                [2, 2, 2, 0]
            ];
        case 'L':
            return [
                [0, 0, 3, 0],
                [3, 3, 3, 0]
            ];
        case 'O':
            return [
                [0, 4, 4, 0],
                [0, 4, 4, 0]
            ];
        case 'S':
            return [
                [0, 5, 5, 0],
                [5, 5, 0, 0]
            ];
        case 'Z':
            return [
                [6, 6, 0, 0],
                [0, 6, 6, 0]
            ];
        case 'T':
            return [
                [0, 7, 0, 0],
                [7, 7, 7, 0]
            ];
        default:
            return [
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
    }
};

/**
 * Gets a neatly formatted 4x4 table with a single piece.
 * Used in the preview for upcoming pieces, held pieces and piece counts.
 */
export const getPreviewPieceTable = (nextPieces: Piece[]): number[][] => {
    const table: number[][] = [];

    for (let i = 0; i < nextPieces.length; i++) {
        table.push([0, 0, 0, 0]);
        table.push(...getDefaultPiece(nextPieces[i].name));
    }

    table.push([0, 0, 0, 0]);

    return table;
};
